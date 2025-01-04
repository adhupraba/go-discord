//
// Code generated by go-jet DO NOT EDIT.
//
// WARNING: Changes to this file may cause incorrect behavior
// and will be lost if the code is regenerated
//

package table

import (
	"github.com/go-jet/jet/v2/postgres"
)

var Profiles = newProfilesTable("public", "profiles", "")

type profilesTable struct {
	postgres.Table

	// Columns
	ID        postgres.ColumnString
	UserID    postgres.ColumnString
	Name      postgres.ColumnString
	ImageURL  postgres.ColumnString
	Email     postgres.ColumnString
	CreatedAt postgres.ColumnTimestampz
	UpdatedAt postgres.ColumnTimestampz

	AllColumns     postgres.ColumnList
	MutableColumns postgres.ColumnList
}

type ProfilesTable struct {
	profilesTable

	EXCLUDED profilesTable
}

// AS creates new ProfilesTable with assigned alias
func (a ProfilesTable) AS(alias string) *ProfilesTable {
	return newProfilesTable(a.SchemaName(), a.TableName(), alias)
}

// Schema creates new ProfilesTable with assigned schema name
func (a ProfilesTable) FromSchema(schemaName string) *ProfilesTable {
	return newProfilesTable(schemaName, a.TableName(), a.Alias())
}

// WithPrefix creates new ProfilesTable with assigned table prefix
func (a ProfilesTable) WithPrefix(prefix string) *ProfilesTable {
	return newProfilesTable(a.SchemaName(), prefix+a.TableName(), a.TableName())
}

// WithSuffix creates new ProfilesTable with assigned table suffix
func (a ProfilesTable) WithSuffix(suffix string) *ProfilesTable {
	return newProfilesTable(a.SchemaName(), a.TableName()+suffix, a.TableName())
}

func newProfilesTable(schemaName, tableName, alias string) *ProfilesTable {
	return &ProfilesTable{
		profilesTable: newProfilesTableImpl(schemaName, tableName, alias),
		EXCLUDED:      newProfilesTableImpl("", "excluded", ""),
	}
}

func newProfilesTableImpl(schemaName, tableName, alias string) profilesTable {
	var (
		IDColumn        = postgres.StringColumn("id")
		UserIDColumn    = postgres.StringColumn("user_id")
		NameColumn      = postgres.StringColumn("name")
		ImageURLColumn  = postgres.StringColumn("image_url")
		EmailColumn     = postgres.StringColumn("email")
		CreatedAtColumn = postgres.TimestampzColumn("created_at")
		UpdatedAtColumn = postgres.TimestampzColumn("updated_at")
		allColumns      = postgres.ColumnList{IDColumn, UserIDColumn, NameColumn, ImageURLColumn, EmailColumn, CreatedAtColumn, UpdatedAtColumn}
		mutableColumns  = postgres.ColumnList{UserIDColumn, NameColumn, ImageURLColumn, EmailColumn, CreatedAtColumn, UpdatedAtColumn}
	)

	return profilesTable{
		Table: postgres.NewTable(schemaName, tableName, alias, allColumns...),

		//Columns
		ID:        IDColumn,
		UserID:    UserIDColumn,
		Name:      NameColumn,
		ImageURL:  ImageURLColumn,
		Email:     EmailColumn,
		CreatedAt: CreatedAtColumn,
		UpdatedAt: UpdatedAtColumn,

		AllColumns:     allColumns,
		MutableColumns: mutableColumns,
	}
}
